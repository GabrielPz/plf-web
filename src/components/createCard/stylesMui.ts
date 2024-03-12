
export const mainCard = {
    width: '50%',
    height: '60%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
}


export const ibeaconCardModel = {
    width: '50%',
    height: '30%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
}

export const buttonStyle = {
    backgroundColor: '#F46A29', 
    color: '#fff', width: '25%', 
    padding: '0.5rem', 
    "&:hover": {backgroundColor: '#F46A29'} 
}

export const openMapButtonStyle = {
    backgroundColor: '#F46A29', 
    color: '#fff', width: '50%', 
    padding: '0.5rem', 
    "&:hover": {backgroundColor: '#F46A29'} 
}

export const finishButtonStyle = {
    backgroundColor: '#F46A29', 
    color: '#fff', width: '35%', 
    padding: '0.5rem', 
    "&:hover": {backgroundColor: '#F46A29'} 
}

export const BoxContainerStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'center'
}