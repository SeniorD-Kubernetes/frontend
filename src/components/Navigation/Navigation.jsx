import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import tyr from 'Utils/tyr';
import './Navigation.scss';

import Tear from '../Tear/Tear';

// eslint-disable-next-line no-underscore-dangle
const NavLink = ({ to, text, active }) => (
  <Link to={to} className={`${active() && 'active'} navlink`}>
    <div className="text">{text}</div>
  </Link>
);

const Navigation = ({ location: { pathname }, history }) => (
  <header className="nav">
    <div className="nav-container">
      <div className="left">
        <Link to="/dashboard">
          <Tear sizeClass="icon" />
        </Link>
        <NavLink
          to="/dashboard"
          text="Dashboard"
          active={() => ['/dashboard', '/dashboard/'].includes(pathname)}
        />
        <NavLink
          to="/dashboard/course"
          text="Courses"
          active={() => pathname.includes('/dashboard/course')}
        />
        <NavLink
          to="/dashboard/calendar"
          text="Calendar"
          active={() => pathname.includes('/dashboard/calendar')}
        />
      </div>
      <div className="right">
        <button
          type="button"
          onClick={async () => {
            await tyr.get('auth/logout');
            history.push('/');
          }}
          className="logout"
        >
          Log Out
        </button>
      </div>
    </div>
  </header>
);

export default withRouter(Navigation);
