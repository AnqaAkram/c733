import React, { useEffect, useState } from 'react';
import spacetime from 'spacetime';

export default function MyCustomWidget() {
    
    //setting initial values for the origin time zone which will default to local timezone 
    const [originTimezone, setOriginTimezone] = useState({
        date: new Date().toISOString().slice(0, -14),
        time: new Date().toTimeString().slice(0, 5),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.toLocaleLowerCase()
    });
    //setting initial values for the target time zone which will default to eastern timezone in America/New_York
    const [targetTimezone, setTargetTimezone] = useState({
        date: spacetime.now().goto('America/New_York').format("iso-short"),
        time: spacetime.now().goto('America/New_York').format("{hour-24-pad}:{minute-pad}"),
        timezone: 'america/new_york'
    })
    //setting intial values for timezone options to be shown in the dropdown list
    const [timezoneOptions, setTimezoneOptions] = useState([]);

    const fetchOptions = () => {
        const fetchedOptions = Object.keys(spacetime.timezones()).slice(0, -114); //populating options for timezone using spacetime lib 
        setTimezoneOptions(fetchedOptions);
    };
    useEffect(() => {
        fetchOptions(); //setting timezone options on initial component mount time
    }, []);

    // timezone, date & time change handler function 
    const handleChange = (event) => {
        
        const { name, value } = event.target;
        
        //when target timezone i.e. tz is changed, update the date & time of target tz w.r.t to the date & time in origin tz & target tz itself
        if (name === 'targetTimezoneSelecter') {

            const originST = spacetime(originTimezone.date + " " + originTimezone.time, originTimezone.timezone);
            const destST = originST.goto(value);
            setTargetTimezone({ date: destST.format("iso-short"), time: destST.format("{hour-24-pad}:{minute-pad}"), timezone: value });
          
        }
        //when target Date is changed, update the target tz's date alongwith the changes reflected in the date & time in origin tz 
        else if (name === 'targetDate') {

            const destST = spacetime(value + " " + targetTimezone.time, targetTimezone.timezone)
            const originST = destST.goto(originTimezone.timezone);
            setTargetTimezone({ ...targetTimezone, date: value });
            setOriginTimezone({ ...originTimezone, date: originST.format('iso-short'), time: originST.format("{hour-24-pad}:{minute-pad}") });
        
        }

        //when target time is changed, update target tz's time alongwith the changes reflected in the date & time in origin tz
        else if (name === 'targetTime') {

            const destST = spacetime(targetTimezone.date + " " + value, targetTimezone.timezone)
            const originST = destST.goto(originTimezone.timezone);
            setTargetTimezone({ ...targetTimezone, time: value });
            setOriginTimezone({ ...originTimezone, date: originST.format('iso-short'), time: originST.format("{hour-24-pad}:{minute-pad}") });
           

        }

        //when the origin date is changed, update the origin tz's date alongwith the the changes reflected in the date & time of target tz  
        else if (name === 'originDate') {

            const originST = spacetime(value + " " + originTimezone.time, originTimezone.timezone);
            const destST = originST.goto(targetTimezone.timezone);
            setOriginTimezone({ ...originTimezone, date: value });
            setTargetTimezone({ ...targetTimezone, date: destST.format("iso-short"), time: destST.format("{hour-24-pad}:{minute-pad}") });
           
        }
        //when the origin time is changed, update the origin tz's date alongwith any changes reflected in the date & time of the target tz
        else if (name === 'originTime') {

            const originST = spacetime(originTimezone.date + " " + value, originTimezone.timezone);
            const destST = originST.goto(targetTimezone.timezone);
            setOriginTimezone({ ...originTimezone, time: value });
            setTargetTimezone({ ...targetTimezone, date: destST.format("iso-short"), time: destST.format("{hour-24-pad}:{minute-pad}") });
          
        }

        //when the origin timezone is changed, update the date & time of origin tz w.r.t to the date & time in target tz & origin tz itself
        else if (name === 'originTimezoneSelecter') {

            const destST = spacetime(targetTimezone.date + " " + targetTimezone.time, targetTimezone.timezone);
            const originST = destST.goto(value);
            setOriginTimezone({ date: originST.format('iso-short'), time: originST.format("{hour-24-pad}:{minute-pad}"), timezone: value })
          
        }


    };

    return (
        <div style={{ minWidth: 300 }}>
            <p style={{ textAlign: "center" }}>Timezone Converter</p>
            <div className='timezoneConverter-container' style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", marginTop: '10px' }}>
                <div className='OriginTimezone' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    <select name='originTimezoneSelecter' className='Timezone-Selecter' id="originTimezone-Selecter" onChange={handleChange} value={originTimezone.timezone}>
                        {timezoneOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}</select>
                    <input type='date' name='originDate' className='originDate' value={originTimezone.date} onChange={handleChange}></input>
                    <input type='time' name='originTime' className='originTime' value={originTimezone.time} onChange={handleChange}></input>
                </div>
                <div className='verticalDivider' style={{ marginLeft: '10px', marginRight: '10px', borderLeftColor: 'white', borderLeftStyle: 'solid', borderLeftWidth: '3px', height: '100px' }}></div>
                <div className='TargetTimezone' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    <select name='targetTimezoneSelecter' className='Timezone-Selecter' id="targetTimezone-Selecter" onChange={handleChange} value={targetTimezone.timezone}>
                        {timezoneOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                    <input type='date' name='targetDate' className='TargetDate' value={targetTimezone.date} onChange={handleChange}></input>
                    <input type='time' name='targetTime' className='TargetTime' value={targetTimezone.time} onChange={handleChange}></input>
                </div>
            </div>
        </div>

    )
}