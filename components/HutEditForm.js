//styled in _hutedit.scss
import React, { useState, useEffect } from 'react';
import { getLocations } from '../actions/locationActions';
import { getTypes } from '../actions/typeActions';
import { updateHut } from '../actions/hutActions';



const HutEditForm = ({ values, setValues, handleChange, handleSubmit, children }) => {
    const { name, latitude, longitude, location, type, where, objectdescription, water, warning, addedby } = values;



    //GET LOCATIONS AND TYPES
    const [locations, setLocations] = useState([]);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [types, setTypes] = useState([]);
    const [typesLoading, setTypesLoading] = useState(true);
    
    const fetchAllLocations = () => {
        setLocationsLoading(true);
        getLocations()
            .then(data => {
                if (data.error) {
                    showPopup(data.error);
                    setLocationsLoading(false);
                    return;
                }

                setLocations(data);
                setLocationsLoading(false);
            })
    };

    const fetchAllTypes = () => {
        setTypesLoading(true);
        getTypes()
            .then(data => {
                if (data.error) {
                    showPopup(data.error);
                    setTypesLoading(false);
                }

                setTypes(data);
                setTypesLoading(false);
            })
    };

    useEffect(() => {
        fetchAllLocations();
        fetchAllTypes();
    }, []);

    

    //RENDER
    return (
        <React.Fragment>

            {
                locationsLoading || typesLoading ?
                <p>Loading...</p>
                :
                locations.length < 1 || types.length < 1 ?
                <p>Locations and Types could not be loaded. Either try reloading the page or make sure there is at least one Location and one Type created.</p>
                :
                <form onSubmit={handleSubmit}>
                    <h2>Edit Hut</h2>

                    {children}

                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text" name='name' value={name} onChange={handleChange} placeholder='Hut name' />
                    </div>

                    <div className="form-group">
                        <label>Latitude</label>
                        <input type="text" name='latitude' value={latitude} onChange={handleChange} placeholder='19.36903062735725' />
                    </div>

                    <div className="form-group">
                        <label>Longitude</label>
                        <input type="text" name='longitude' value={longitude} onChange={handleChange} placeholder='18.85306048433267' />
                    </div>
                
                    <div className="form-group">
                        <label>Mountain Range: </label>
                        <select name="location" value={location} onChange={handleChange}>
    
                            {locations.map(l => (
                                <option 
                                    key={l._id}
                                    value={l._id}
                                >
                                    {l.name}
                                </option>
                            ))}

                        </select>
                    </div>

                    <div className="form-group">
                        <label>Hut Type: </label>
                        <select name="type" value={type} onChange={handleChange}>

                        {types.map(t => (
                                <option 
                                    key={t._id} 
                                    value={t._id}
                                    >
                                        {t.name}
                                    </option>
                            ))}

                        </select>
                    </div>

                    <div className="form-group">
                        <label>Where: </label>
                        <textarea 
                            placeholder='e.g.: Situated in Velka Fatra at the end of Ciernavy (a fork of the Lubochnianska Dolina Valley) on the Southern slope of Madarova Hill. Getting there involves approximately an hour of off-trail hiking.'
                            name='where'
                            value={where}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Object Description: </label>
                        <textarea 
                            placeholder='e.g.: A small hunters hut with a stove, 4 beds, shelves with candles, matches, cups... Usually has a lot of firedwood stocked up on the porch. A small but really cozy place. Also has an attic should your party need more sleeping space.'
                            name='objectdescription'
                            value={objectdescription}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nearest Water Source: </label>
                        <textarea 
                            placeholder='e.g.: When your back is to the cabin door, just go left some 50m. Theres a spring that doesnt go dry.'
                            name='water'
                            value={water}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Any Warnings?: </label>
                        <textarea 
                            placeholder='e.g.: This cabin is open for hikers but wont stay that way if it becomes a weekend party spot. Please, leave it as tidy as you found it when you came and restock any wood you burn.'
                            name='warning'
                            value={warning}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <button type='submit' className='submit-btn'>Edit Hut</button>
                    </div>
                </form>
            }
        </React.Fragment>
    )
}

export default HutEditForm;
