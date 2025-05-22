import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import ArticlePage from "./pages/articles/ArticlePage";
import ArticlesPage from "./pages/articles/ArticlesPage";
import LoginForm from "./pages/account/LoginForm";
import LogoutForm from "./pages/account/LogoutForm";
import SignUpForm from "./pages/account/SignUpForm";
import ArticleCreateForm from "./pages/articles/ArticleCreateForm";
import ArticleEditForm from "./pages/articles/ArticleEditForm";
import { useCurrentAuthUser } from "./contexts/AuthUserContext";
import "./api/axiosDefaults";

function App() {

  const currentUser = useCurrentAuthUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <ArticlesPage />} />
          <Route exact path="/login" render={() => <LoginForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/logout" render={() => <LogoutForm />} />
          <Route exact path="/articles/create" render={() => <ArticleCreateForm />} />
          <Route exact path="/articles/:id/edit" render={() => <ArticleEditForm />} />
          <Route exact path="/articles/:id" render={() => <ArticlePage />} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;