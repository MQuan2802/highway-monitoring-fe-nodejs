import React from 'react'

export const SummaryItem = ({label, description, value}) => {
    return (
        <div style={{width: '500px', textAlign: 'center', padding: '10px', border: '1px solid #000000',}}>
            <div>
                <h2 style={{fontSize: 'bold'}}>{label}</h2>
                {description ? <p style={{color: 'grey'}}>{description}</p> : null}
            </div>
            <p style={{fontSize: '70px', fontWeight:'500'}}>{value}</p>
        </div>
    )
}