import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Header() {
  return (
    <AppBar position="static" color="default" elevation={0} sx={{ marginBottom: 3 }}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Объявления о сдаче квартир
          </Link>
        </Typography>
        <Button
          component={Link}
          to="/add"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Добавить объявление
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;