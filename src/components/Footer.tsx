import React from 'react'; // Importa a biblioteca React

// Definição da interface Props para o componente Footer
interface FooterProps {
    year: number; // Ano atual a ser exibido no rodapé
    companyName: string; // Nome da empresa
}

// Componente funcional Footer
const Footer: React.FC<FooterProps> = ({ year, companyName }) => {
    // Validação do ano
    if (year < 1900 || year > new Date().getFullYear()) {
        alert('Ano inválido!'); // Alertar se o ano for inválido
    }

    // Validação do nome da empresa
    const validCompanyName = companyName.trim() !== '' ? companyName : 'AxionOS';

    return (
        <footer className="bg-gray-800 text-white p-4 text-center">
            <p>&copy; {year} {validCompanyName}. Todos os direitos reservados.</p>
        </footer>
    );
};

export default Footer;