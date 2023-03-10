import { Container, Spacer, Center, Heading, Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button, Divider } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    return (<>
    <Center
    height={'98px'}
    width={'100%'}
    backgroundColor={'#2A3439'}
    >
        <Container maxW='1200px' centerContent padding='0 32px'>

            <Center
            gap='16px'
            width={'100%'}
            >
                <Heading
                color={'white'}
                >
                    Bloxs
                </Heading>
                <Spacer/>

                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Acesso
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={()=>navigate('/login')}>
                            Login
                        </MenuItem>
                        <MenuItem onClick={()=>navigate('/signup')}>
                            Inscreva-se
                        </MenuItem>
                        <Divider/>

                        <MenuItem onClick={()=>navigate('/admin')}>
                            Sobre
                        </MenuItem>
                    </MenuList>
                </Menu>

            </Center>
        </Container>
    </Center>
    </>);
}

export default Header;
