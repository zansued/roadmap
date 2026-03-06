import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './components/NotFound'; // Componente para rotas não encontradas

interface AppProps {}

const App: FC<AppProps> = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route component={NotFound} />
            </Switch>
            <Footer />
        </Router>
    );
};

export default App;