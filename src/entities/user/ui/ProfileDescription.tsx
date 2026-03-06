import { Text } from "@mantine/core";
import { useAuthStore } from "../contexts/auth.context";

const ProfileDescription = () => {
    const { user } = useAuthStore();
    return (
        <Text
            c='white'
            fz={14}
            lh={'15px'}
            w={'75%'}
            opacity={.5}
            fw={400}
            className="text-center"
        >
            Молодой блогер николаич любит бананы, чемодан вокзал африка
        </Text>
    )
}

export default ProfileDescription