import React from "react";
import "../style.css";
import {Link} from 'react-router-dom'


class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "category":JSON.parse(localStorage.getItem("category")),
      "searchValue": ""
    }
  }

  handleSearchClick = () => {
    this.fetchProduct()
  }

  fetchProduct = async () => {

    try{
        const { user } = this.props;

        let response = await fetch("http://localhost:8080/search-product",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchQuery: this.state.searchValue,
                userId: String(user.id)
            })
        })

        if(response.ok){
            const data = await response.json()
            console.log(data)
            this.props.navigate(`/search`,{
              state: { products: data, searchValue: this.state.searchValue }
            })
        } else{
            alert("Something went wrong on server...")
        }

    } catch(error){
        console.log(error)
    }

  }


  render() {
    const { user,cartCount } = this.props;

    return (
      <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
          <Link className="navbar-brand" to="/">
            MarketMatrix
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="men">
                  Men
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="women">
                  Women
                </Link>
              </li>

              <li className="nav-item active">
                <div className="btn-group">
                  <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                      Categories
                  </button>

                  <ul className="dropdown-menu">
                  
                    {
                      this.state.category? this.state.category.map(
                        (value, index) => {
                          return(
                            <li key={index}>
                            <a className="dropdown-item" href={`#${value.id}`}>
                              {value.catName} - {value.sectionName}
                            </a>
                            </li>
                          )
                        }
                      )
                       : <li className="dropdown-item">
                      No Categories
                    </li>
                    }
                    
                  </ul>

                </div>
              </li>
            </ul>
            <div className="w-50 align-items-center mr-auto">
              <form className="form-inline my-2 my-lg-0" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="form-control mr-sm-2 w-75"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={ (e) => this.setState({"searchValue": e.target.value})  }
                />
                {this.state.searchValue.trim().length > 0 ?
                <button className="btn btn-primary my-2 my-sm-0 p-1 search-button" onClick={this.handleSearchClick.bind(this)} type="button" > 
                  Search
                </button>
                : <span className="btn btn-primary my-2 my-sm-0 p-1 search-button">Search</span>
                }
                
              </form>
            </div>

            <div className="d-flex align-items-center mx-2">
              <Link to="/cart">
              <button
                className="btn btn-primary position-relative d-flex align-items-center mx-2"
              >
                <span className="me-3">
                  <i className="bi bi-cart text-white"></i>
                  <span
                    id="cart-count"
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  >
                    {cartCount}
                  </span>
                </span>
              </button>
              </Link>

                {
                  user !== null?
                  <span className="nav-link text-white fw-bold ml-2">Welcome, {user.fullName}</span>
                  : <Link className="nav-link text-white fw-bold ml-2" to="/signin">Login</Link>
                }
                
            </div>
          </div>
        </nav>

      </>
    );
  }
}

export default Navbar;
