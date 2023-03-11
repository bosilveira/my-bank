import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';

export interface conta {
    dataCriacao: string,
    flagAtivo: boolean,
    limiteSaqueDiario: string,
    saldo: string,
    tipoConta: number,
    idConta: string
}

export interface transacao {
    dataTransacao: string,
    idConta: string,
    idPessoa: string,
    idTransacao: string,
    idUsuario: string,
    valor: string
}

export interface carteira {
    idPessoa: string,
    idUsuario: string,
    flagAtivo: boolean,
    nome: string,
    cpf: string,
    nascimento: string,
    email: string,
    contas: conta[],
}

export interface userState {
    carteira: carteira | null,
    token: string | null,
    status: 'idle' | 'loading' | 'failed' | 'subscribed' | 'logged' | 'logout'  | 'update',
    transactions: transacao[] | null

}

const initialState: userState = {
    carteira: null,
    token: null,
    status: 'idle',
    transactions: null
};

export const login = createAsyncThunk(
    'user/login',
    async ( args: any ) => {
        const { email, senha } = args;
        const result = await fetch(`http://localhost:5000/cliente/logar`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha })
        })
        .then(response => {
            if (response.status !== 200) {
                throw new Error();
            }
            return response.json();
        })
        .then(data=> {
            console.log(data)
            return data.token;
        })
        return result;
    }
);

export const signup = createAsyncThunk(
    'user/signup',
    async ( args: any ) => {
        const { nome, cpf, nascimento, email, senha } = args;
        console.log(nome, cpf, nascimento, email, senha)
        const result = await fetch(`http://localhost:5000/cliente/inscrever`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, cpf, nascimento, email, senha })
        })
        .then(response => {
            if (response.status !== 201) {
                throw new Error();
            }
            return response.json();
        })
        .then(data=> {
            return data;
        })
        return result;
    }
);

export const getWallet = createAsyncThunk(
    'user/getWallet',
    async ( args = undefined, {getState} ) => {
        const state = getState() as any;
        const result = await fetch(`http://localhost:5000/cliente/carteira`, {
            method: "GET",
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'x-access-tokens': `${(state.user.token)}`,
            },
        })
        .then(response => {
            console.log(response)
            if (response.status !== 200) {
                throw new Error();
            }
            return response.json();
        })
        .then(data=> {
            console.log(data)
            return data;
        })
        return result;
    }
);

export const getTransactions = createAsyncThunk(
    'user/getTransactions',
    async ( args = undefined, {getState} ) => {
        const state = getState() as any;
        const result = await fetch(`http://localhost:5000/cliente/transacoes`, {
            method: "GET",
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'x-access-tokens': `${(state.user.token)}`,
            },
        })
        .then(response => {
            console.log('trans', response)
            if (response.status !== 200) {
                throw new Error();
            }
            return response.json();
        })
        .then(data=> {
            console.log(data)
            return data;
        })
        return result;
    }
);

export const newAccount = createAsyncThunk(
    'user/newAccount',
    async ( args = undefined, {getState} ) => {
        const state = getState() as any;
        const result = await fetch(`http://localhost:5000/conta/criar`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'x-access-tokens': `${(state.user.token)}`,
            },
            body: JSON.stringify({ 'idPessoa': state.user.carteira.idPessoa })

        })
        .then(response => {
            if (response.status !== 200) {
                throw new Error();
            }
            return response.json();
        })
        .then(data=> {
            return data;
        })
        return result;
    }
);



export const deposit = createAsyncThunk(
    'user/deposit',
    async ( args: any, {getState} ) => {
        const state = getState() as any;
        const { idConta, valor } = args;
        const result = await fetch(`http://localhost:5000/transacao/depositar`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'x-access-tokens': `${(state.user.token)}`,
            },
            body: JSON.stringify({ 'idConta': idConta, 'valor': valor })
        })
        .then(response => {
            if (response.status !== 200) {
                throw new Error();
            }
            return response.json();
        })
        .then(data=> {
            return data;
        })
        return result;
    }
);

export const withdraw = createAsyncThunk(
    'user/withdraw',
    async ( args: any, {getState} ) => {
        const state = getState() as any;
        const { idConta, valor } = args;
        const result = await fetch(`http://localhost:5000/transacao/sacar`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'x-access-tokens': `${(state.user.token)}`,
            },
            body: JSON.stringify({ 'idConta': idConta, 'valor': valor })
        })
        .then(response => {
            if (response.status !== 200) {
                throw new Error();
            }
            return response.json();
        })
        .then(data=> {
            return data;
        })
        return result;
    }
);

export const transfer = createAsyncThunk(
    'user/transfer',
    async ( args: any, {getState} ) => {
        const state = getState() as any;
        const { idConta_remetente, idConta_destinatario, valor } = args;
        const result = await fetch(`http://localhost:5000/transacao/transferir`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'x-access-tokens': `${(state.user.token)}`,
            },
            body: JSON.stringify({ 'idConta_remetente': idConta_remetente, 'idConta_destinatario': idConta_destinatario, 'valor': valor })
        })
        .then(response => {
            if (response.status !== 200) {
                throw new Error();
            }
            return response.json();
        })
        .then(data=> {
            return data;
        })
        return result;
    }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.carteira = null;
      state.token = null;
      state.status = 'logout';
    },
},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'logged';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'subscribed';
      })
      .addCase(signup.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getWallet.pending, (state, action) => {
        state.status = 'loading';

      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.status = 'idle';
        state.carteira = action.payload as any;
      })
      .addCase(getWallet.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(newAccount.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(newAccount.fulfilled, (state, action) => {
        state.status = 'update';
      })
      .addCase(newAccount.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(deposit.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.status = 'update';
      })
      .addCase(deposit.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(withdraw.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.status = 'update';
      })
      .addCase(withdraw.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(transfer.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(transfer.fulfilled, (state, action) => {
        state.status = 'update';
      })
      .addCase(transfer.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(getTransactions.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.status = 'update';
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state) => {
        state.status = 'failed';
      })

    },
});

export const { logout } = userSlice.actions;

export const userRedux = (state: RootState) => state.user;

export default userSlice.reducer;
