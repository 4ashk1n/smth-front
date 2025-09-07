import type { Empty } from "../../../entities/article/types/blocks/Empty"

const EmptyBlock: React.FC<{block: Empty, editMode?: boolean}> = ({ block, editMode=false }) => {
    return (<>
        {
            editMode ? <>
                <div style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '100px',
                    background: '#000000'
                }}
                >

                </div>
            </> 
            : <></>
        }
    </>)
}

export default EmptyBlock