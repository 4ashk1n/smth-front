import { useRef, useState, useEffect } from "react"

export const useMove = (pos: { x: number, y: number }, setPos: (pos: { x: number, y: number }) => void) => {
    const ref = useRef<HTMLDivElement>(null)
    const [focused, setFocused] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!ref.current) return
            if (disabled) return
            if (!focused) return 
            if (!e.buttons) return

            const containerPos = ref.current.getBoundingClientRect()
            const deltaX = e.clientX - mousePos.x
            const deltaY = e.clientY - mousePos.y
            setMousePos({ x: e.clientX, y: e.clientY })
            const newX = pos.x + deltaX
            const newY = pos.y + deltaY
            const newPos = {
                x: Math.min(Math.max(newX, 0), containerPos.width),
                y: Math.min(Math.max(newY, 0), containerPos.height)
            }
            setPos(newPos)

            if (newX !== newPos.x || newY !== newPos.y) {
                // setFocused(false)
            }
        }

        document.addEventListener('mousemove', onMove)

        return () => {
            document.removeEventListener('mousemove', onMove)
        }
    }, [focused, disabled])

    useEffect(() => {
        enable()
        
        if (ref.current) {
            ref.current.addEventListener('mousedown', ((e) => {
                setFocused(true);
                setMousePos({ x: e.clientX, y: e.clientY })
            }))
            ref.current.addEventListener('mouseup', (() => setFocused(false)))
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener('mousedown', ((e) => {
                    setFocused(true);
                    setMousePos({ x: e.clientX, y: e.clientY })
                }))
                ref.current.removeEventListener('mouseup', (() => setFocused(false)))
            }
        }
    }, [])

    const disable = () => {
        if (focused) return
        setDisabled(true)
        
    }

    const enable = () => {
        setDisabled(false)
    }

    return { ref, disable, enable }
}