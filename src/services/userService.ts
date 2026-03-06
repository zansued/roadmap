```typescript
import supabase from '../supabase_client'; // Cliente do Supabase para interações com a API
import { User } from '../types/User'; // Tipo User para tipagem de dados
import bcrypt from 'bcrypt'; // Biblioteca para hashing de senhas
import { validate as validateEmail } from 'email-validator'; // Biblioteca para validação de email

class UserService {
    private static instance: UserService;

    private constructor() {}

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async signUp(params: { nome: string; email: string; senha: string; plano_assinatura?: string; }): Promise<{ id: string; nome: string; email: string; }> {
        const { nome, email, senha, plano_assinatura } = params;

        if (!nome || !email || !senha) {
            throw new Error('Nome, email e senha são obrigatórios.');
        }

        // Validação do formato de email
        if (!validateEmail(email)) {
            throw new Error('Formato de email inválido.');
        }

        // Verificação de força da senha
        if (senha.length < 8 || !/[A-Z]/.test(senha) || !/[a-z]/.test(senha) || !/[0-9]/.test(senha)) {
            throw new Error('A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.');
        }

        // Hash da senha antes de armazenar
        const hashedPassword = await bcrypt.hash(senha, 10);

        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ nome, email, senha: hashedPassword, plano_assinatura }])
            .single();

        if (error) {
            if (error.code === '23505') { // Erro de email único violado
                throw new Error('Email já cadastrado.');
            }
            throw new Error('Erro ao criar usuário: ' + error.message);
        }

        return { id: data.id, nome: data.nome, email: data.email };
    }

    public async login(params: { email: string; senha: string; }): Promise<{ token: string; user: User; }> {
        const { email, senha } = params;

        if (!email || !senha) {
            throw new Error('Email e senha são obrigatórios.');
        }

        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            throw new Error('Credenciais inválidas.');
        }

        // Verificação da senha
        const isPasswordValid = await bcrypt.compare(senha, data.senha);
        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas.');
        }

        // Aqui você deve integrar com um sistema real de autenticação para gerar um token JWT
        const token = 'gerar-um-token-jwt-aqui'; 

        return { token, user: data as User };
    }

    public async getUser(params: { userId: string; }): Promise<User> {
        const { userId } = params;

        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !data) {
            throw new Error('Usuário não encontrado ou acesso não autorizado.');
        }

        return data as User;
    }
}

export default UserService.getInstance();
```

### Melhorias Implementadas:
1. **Hash da Senha:** A senha é agora armazenada em forma de hash utilizando a biblioteca `bcrypt` antes de ser salva no banco de dados.
2. **Validação de Email:** Adicionada a validação do formato de email, utilizando a biblioteca `email-validator` para garantir que o email informado está no formato correto.
3. **Verificação de Senha:** Ao fazer login, a senha fornecida pelo usuário é comparada com a senha armazenada no banco de dados de forma segura, usando `bcrypt.compare`.
4. **Consistência nos Nomes dos Parâmetros:** Utilização de termos em português e manutenção de nomenclatura consistente ao longo do código.
5. **Integração com Sistema Real de Autenticação:** Adição de um espaço para integração futura de um sistema real de geração de token JWT durante o processo de login.