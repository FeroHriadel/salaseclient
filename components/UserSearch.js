import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { searchUsers } from '../actions/authActions';



const UserSearch = ({ showPopup, values, setValues }) => {
    //API CALL
    const [canMakeCall, setCanMakeCall] = useState(false);

    useEffect(() => {
        if (canMakeCall && values.page <= values.numberOfPages) {
            searchUsers(values.searchword, values.role, values.sortby, values.page + 1)
                .then(data => {
                    if (data.error) {
                        showPopup(data.error);
                        setCanMakeCall(false);
                    }

                    setValues({...values, ...data, users: [...values.users, ...data.users], loading: false});
                    setCanMakeCall(false);
                })
        }
    }, [canMakeCall])



    //FORM
      //form shown?
      const [searchShown, setSearchShown] = useState(false);

      //form fields values
    const [formValues, setFormValues] = useState({
        users: [],
        loading: true,
        searchword: '',
        role: '',
        sortby: '',
        page: 0,
        numberOfPages: 1,
    });
      
      //change handler
    const handleChange = e => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    }

      //submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        setValues(formValues);
        setCanMakeCall(true);
    }



    //RENDER
    return (
        <div className='user-search-container'>
            <p>
                <FontAwesomeIcon icon={faSearch} className='icon' onClick={() => setSearchShown(!searchShown)}/>
            </p>


            <form
                    onSubmit={handleSubmit}
                    style={searchShown ? {width: '100%', height: '150px'} : {width: '0%', height: '0px'}}
            >
                <input type="text" name='searchword' placeholder='Search by keyword' onChange={handleChange} />
                
                <select name="role" onChange={handleChange}>
                    <option value="">All roles</option>
                    <option value='user'>User</option>
                    <option value='admin'>Admin</option>
                </select>

                <select name="sortby" onChange={handleChange}>
                    <option value="">Oldest to Latest</option>
                    <option value="recent">Latest to Oldest</option>
                    <option value="alphabetically">Alphabetically</option>
                </select>

                <button type="submit">Search</button>
            </form>
            
        </div>
    )
}

export default UserSearch;
