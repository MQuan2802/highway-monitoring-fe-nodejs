import React from 'react'

export const SummaryItem = ({label, description, value}) => {
    return (
        <div style={{width: '500px', textAlign: 'center', padding: '10px', border: '1px solid #000000',}}>
            <div>
                <h2 style={{fontSize: 'bold'}}>{label}</h2>
                {description ? <h3 style={{color: 'grey'}}>{description}</h3> : null}
            </div>
            <p style={{fontSize: '60px', fontWeight:'400'}}>{value}</p>
        </div>
    )
}