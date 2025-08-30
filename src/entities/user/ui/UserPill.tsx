import ColoredPill, { type ColoredPillProps } from "../../../shared/pill/ColoredPill"
import type { UserCompact } from "../types/UserCompact"

const UserPill: React.FC<ColoredPillProps & {user: UserCompact}> = ({user, ...props}) => {
    return (
        <ColoredPill image={user.avatar} label={`${user.firstname} ${user.lastname}`} {...props}/>
    )
}

export default UserPill