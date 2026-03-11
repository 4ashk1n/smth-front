
const DarkGradientBackground: React.FC<{
    accentColor: string
}> = ({ accentColor }) => {
    
    
    return <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(0deg, ${accentColor}, #000000 80%)`,
            pointerEvents: "none"
        }}
    >
    </div>
}

export default DarkGradientBackground