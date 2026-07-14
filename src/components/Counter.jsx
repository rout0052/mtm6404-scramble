const Counter = ({ propertyName, currentCount }) => {

    return (
        <div className='has-text-centered'> 
            <h6 className='is-capitalized has-text-weight-bold'>{propertyName}</h6>
            <p className='is-size-1'>{currentCount}</p>
        </div>
    )
}

export default Counter;