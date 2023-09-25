import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    html,
    body {
        background-color: ${props => props.theme.secondary};
        color: white;
    }
    body {
        margin: 0;
        font-family: 'Segoe UI', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    }
    #root {
        height: 100%;
    }
`;

export default GlobalStyle;
