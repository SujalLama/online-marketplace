import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'
import CartIcon from '@material-ui/icons/ShoppingCart'
import Badge from '@material-ui/core/Badge'
import cart from './../cart/cart-helper'
import './menu.css';

const isActive = (history, path) => {
  if (history.location.pathname === path)
    return {color: '#9802dd', fontWeight: 'bolder'}
  else
    return {color: '#000'}
}
const isPartActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return {color: '#9802dd'}
  else
    return {color: '#000'}
}
const Menu = withRouter(({history}) => (
  <nav className="nav-menu">
    <ul>
      <Link to="/" className="nav-item nav-header" style={isActive(history, "/")}><li>MERN marketplace</li></Link>
      <div className="nav-item-group-1">
      <Link to="/shops/all" className="nav-item" style={isActive(history, "/shops/all")}><li>shops</li></Link>
      <Link to="/auctions/all" className="nav-item" style={isActive(history, "/auctions/all")}><li>auctions</li></Link>
      <Link to="/cart" className="nav-item" style={isActive(history, "/cart")}><li>cart
        <Badge invisible={false} color="secondary" badgeContent={cart.itemTotal()} style={{'marginLeft': '7px'}}>
          <CartIcon />
       </Badge>
      </li></Link>
      </div>
      <div className="nav-item-group-2">
      {!auth.isAuthenticated() && <><Link to="/signin" className="nav-item" style={isActive(history, "/signin")}><li>Sign in</li></Link>
      <Link to="/signup" className="nav-item" style={isActive(history, "/signup")}><li>Sign up</li></Link></>
      }
      {
        auth.isAuthenticated() && (<>
          {auth.isAuthenticated().user.seller && (<>
            <Link to="/seller/shops" className="nav-item" style={isPartActive(history, "/seller/")}><li>My Shops</li></Link>
            <Link to="/myauctions" className="nav-item" style={isPartActive(history, "/myauctions")}><li>My Auctions</li></Link>
            </>
          )}
          <Link to={"/user/" + auth.isAuthenticated().user._id} className="nav-item" style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>
            <li>My Profile</li>
          </Link>
          <li  className="nav-item" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}>Sign out</li>
        </>)
      }
      </div>
    </ul>
  </nav>
  // <AppBar position="static">
  //   <Toolbar>
  //     <Typography variant="h6" color="inherit">
  //       MERN Marketplace
  //     </Typography>
  //     <div>
  //       <Link to="/">
  //         <IconButton aria-label="Home" style={isActive(history, "/")}>
  //           <HomeIcon/>
  //         </IconButton>
  //       </Link>
  //       <Link to="/shops/all">
  //         <Button style={isActive(history, "/shops/all")}>All Shops</Button>
  //       </Link>
  //       <Link to="/auctions/all">
  //         <Button style={isActive(history, "/auctions/all")}>All Auctions</Button>
  //       </Link>
  //       <Link to="/cart">
  //         <Button style={isActive(history, "/cart")}>
  //           Cart
  //           <Badge invisible={false} color="secondary" badgeContent={cart.itemTotal()} style={{'marginLeft': '7px'}}>
  //             <CartIcon />
  //           </Badge>
  //         </Button>
  //       </Link>      
  //     </div>
  //     <div style={{'position':'absolute', 'right': '10px'}}><span style={{'float': 'right'}}>
  //     {
  //       !auth.isAuthenticated() && (<span>
  //         <Link to="/signup">
  //           <Button style={isActive(history, "/signup")}>Sign up
  //           </Button>
  //         </Link>
  //         <Link to="/signin">
  //           <Button style={isActive(history, "/signin")}>Sign In
  //           </Button>
  //         </Link>
  //       </span>)
  //     }
  //     {
  //       auth.isAuthenticated() && (<span>
  //         {auth.isAuthenticated().user.seller && (<>
  //           <Link to="/seller/shops"><Button style={isPartActive(history, "/seller/")}>My Shops</Button></Link>
  //           <Link to="/myauctions"><Button style={isPartActive(history, "/myauctions")}>My Auctions</Button></Link>
  //           </>
  //         )}
  //         <Link to={"/user/" + auth.isAuthenticated().user._id}>
  //           <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
  //         </Link>
  //         <Button color="inherit" onClick={() => {
  //             auth.clearJWT(() => history.push('/'))
  //           }}>Sign out</Button>
  //       </span>)
  //     }
  //     </span></div>
  //   </Toolbar>
  // </AppBar>
))

export default Menu
