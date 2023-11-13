import { Icon, IconProps, StackProps, Text, VStack } from '@chakra-ui/react';

import { IconType } from 'react-icons';

interface CalculatorMenuItemProps {
    isActive: boolean;
    onClick: () => unknown;
    icon: IconType | ((props: IconProps) => JSX.Element);
    label: string;
}

export const CalculatorMenuItem = ({ isActive, onClick, icon, label }: CalculatorMenuItemProps) => {
    const menuItemProps = { icon, label, onClick };
    const activeProps = isActive ? { color: 'gray.800', bgColor: 'brand.blush' } : {};
    const groupHoverProps = !isActive
        ? {
              _hover: { bgColor: 'brand.blush', color: 'gray.800' },
              transition: 'background-color 0.3s, color 0.3s'
          }
        : {};

    return <MenuItem py={3} px={6} rounded="lg" {...groupHoverProps} {...activeProps} {...menuItemProps} />;
};

type MenuItemProps = StackProps & Omit<CalculatorMenuItemProps, 'isActive'>;

const MenuItem = ({ icon, label, onClick, ...stackProps }: MenuItemProps) => {
    return (
        <VStack cursor="pointer" onClick={onClick} py={2} {...stackProps}>
            <Icon as={icon} boxSize={8} />
            <Text fontSize="sm" textAlign="center" whiteSpace="nowrap">
                {label}
            </Text>
        </VStack>
    );
};
