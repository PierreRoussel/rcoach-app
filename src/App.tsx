import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { AuthError, Session } from '@supabase/supabase-js';
import { LoginPage } from './pages/Sign/Login';
import { AccountPage } from './pages/Account/Account';
import Home from './pages/Home';

import '@ionic/react/css/ionic.bundle.css';

/* Theme variables */
import './theme/variables.css';
import './styles/main.scss';
/* Icons */
import 'iconoir/css/iconoir.css';
import Journal from './pages/journal/Journal';
import { RecapRun } from './pages/journal/recap-run/Log';
import Seances from './pages/seances/Seances';
import { initStores } from './stores/store.initer';
import { Seance } from './pages/seances/seance/Seance';
import { RunPage } from './pages/seances/run/Run';
import Calendrier from './pages/calendrier/Calendrier';

setupIonicReact();

const App: React.FC = () => {
  initStores();

  const [session, setSession] = useState<Session>();
  useEffect(() => {
    getSessionAndSet();
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setSession(session);
    });
  }, []);

  async function getSessionAndSet() {
    supabase.auth
      .getSession()
      .then(
        (
          value:
            | { data: { session: Session }; error: null }
            | { data: { session: null }; error: AuthError }
            | { data: { session: null }; error: null }
        ) => {
          if (value.error) return console.log(value.error);
          if (value.data.session === null) return;
          setSession(value.data.session);
        }
      );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path='/'
            render={() => {
              return session ? <Home /> : <LoginPage />;
            }}
          />
          <Route
            exact
            path='/login'
            render={() => {
              return session ? <Home /> : <LoginPage />;
            }}
          />
          <Route exact path='/journal/:id' component={RecapRun} />
          <Route exact path='/journal'>
            <Journal />
          </Route>
          <Route exact path='/seance/:id' component={Seance} />
          <Route exact path='/run/:id' component={RunPage} />
          <Route exact path='/seance'>
            <Seances />
          </Route>
          <Route exact path='/calendrier'>
            <Calendrier />
          </Route>
          <Route exact path='/account'>
            <AccountPage />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
