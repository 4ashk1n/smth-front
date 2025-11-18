import ColoredPill, { type ColoredPillProps } from "../../../shared/ui/pill/ColoredPill"
import type { User } from "../types/user.types"

const UserPill: React.FC<ColoredPillProps & {user: User}> = ({user, ...props}) => {
    return (
        <ColoredPill image={user.avatar} label={`${user.firstname} ${user.lastname}`} {...props}/>
    )
}

export default UserPill