//styled in _locationEdit.scss
import React from 'react';



const LocationEditForm = ({ values, setValues, handleChange, handleSubmit }) => {
    const { name, maxLong, minLong, maxLat, minLat } = values;


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Name: </label>
                <input type="text" name='name' value={name} onChange={handleChange} placeholder='Velka Fatra' />
            </div>

            <div className="form-group">
                <label>Max. Longitude (West limit)</label>
                <input type="text" name='maxLong' value={maxLong} onChange={handleChange} placeholder='19.36903062735725' />
            </div>

            <div className="form-group">
                <label>Min. Longitude (East limit)</label>
                <input type="text" name='minLong' value={minLong} onChange={handleChange} placeholder='18.85306048433267' />
            </div>

            <div className="form-group">
                <label>Max. Latitude (North limit)</label>
                <input type="text" name='maxLat' value={maxLat} onChange={handleChange} placeholder='49.19255589084542' />
            </div>

            <div className="form-group">
                <label>Min. Latitude (South limit)</label>
                <input type="text" name='minLat' value={minLat} onChange={handleChange} placeholder='48.78610159628138' />
            </div>

            <button type='submit'>Edit Location</button>
        </form>
    )
}

export default LocationEditForm;
