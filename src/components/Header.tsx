import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <h1>Мое приложение</h1>
      <nav>
        {/* Используйте обычные <a> теги или оберните Link в проверку */}
        <a href="/">Главная</a>
        {/* Или */}
        {typeof Link !== 'undefined' ? <Link to="/">Главная</Link> : <a href="/">Главная</a>}
      </nav>
    </header>
  );
};

export default Header;