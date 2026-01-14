import React from "react";
import ResizeHandleIcon from "../../../../shared/icon/ResizeHandleIcon";

const ResizeHandle = React.forwardRef<any, any>((props: any, ref) => {
    const { handleAxis, ...restProps } = props;
    if (restProps.hidden) return null

    return (
        <div
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                // border: '1px solid red',
                top: 0,
                left: 0,
                zIndex: '9000',
                borderRadius: '10px',
            }}
        >
            <ResizeHandleIcon
                className={`
                    react-resizable-handle 
                    opacity-50 
                    hover:opacity-100 
                    hover:scale-110 
                    hover:webkit-filter:drop-shadow(0px 20px 10px #FFFFFF)
                    hover:filter:drop-shadow(0px 20px 10px #FFFFFF)
                    transition 
                    ease-in-out 
                    duration-100`}
                {...restProps}
                ref={ref}
                style={{
                    width: 16,
                    height: 16,
                    zIndex: 99999,
                    position: 'absolute',
                    bottom: -5,
                    right: -5,
                }}
            />
            {/* <ActionIcon
                size={'xs'}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 16,
                    height: 16,
                    // background: 'black',
                    zIndex: 99999,
                    padding: 0,
                }}
                radius={5}
                color={restProps.color || 'black'}
                autoContrast
                className={`react-resizable-handle`}
                {...restProps}

            >
                <PiArrowsOutSimple  style={{
                    rotate: '90deg',
                }} />
            </ActionIcon> */}
        </div>
    )
})

export default ResizeHandle