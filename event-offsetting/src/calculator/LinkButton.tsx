import { LinkOverlay, LinkOverlayProps } from '@chakra-ui/react';
import { Button, ButtonProps, forwardRef, HStack, LinkBox } from '@chakra-ui/react';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { PropsWithChildren } from 'react';

import { cnaughtTheme } from './theme';

type LinkButtonProps = PropsWithChildren<
    {
        href: string;
        isExternal?: boolean;
        isRoute?: boolean;
        ignoreSandboxState?: boolean;
    } & ButtonProps
>;

export const LinkButton = forwardRef(
    (
        {
            children,
            href,
            ignoreSandboxState,
            isRoute = true,
            isExternal = false,
            leftIcon,
            rightIcon,
            ...props
        }: LinkButtonProps,
        ref
    ) => {
        const isExternalProps = isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {};

        return !isExternal && isRoute ? (
            <Button ref={ref} {...props} px={0} py={0}>
                <LinkBox w="full" h="full">
                    <HStack
                        justify="center"
                        h="full"
                        padding={(cnaughtTheme as any).components.Button.baseStyle.padding}
                    >
                        {leftIcon}
                        <RouteLinkOverlay href={href} ignoreSandboxState={ignoreSandboxState}>
                            {children}
                        </RouteLinkOverlay>
                        {rightIcon}
                    </HStack>
                </LinkBox>
            </Button>
        ) : (
            <Button
                ref={ref}
                as={props.isDisabled ? 'button' : 'a'}
                href={href}
                {...isExternalProps}
                {...props}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
            >
                {children}
            </Button>
        );
    }
);

type RouteLinkOverlayProps = { ignoreSandboxState?: boolean } & LinkOverlayProps & NextLinkProps;

const RouteLinkOverlay = ({ children, href, ignoreSandboxState = false, ...rest }: RouteLinkOverlayProps) => {
    href = href ?? '';

    return (
        <LinkOverlay href={href} {...rest} as={NextLink}>
            {children}
        </LinkOverlay>
    );
};
