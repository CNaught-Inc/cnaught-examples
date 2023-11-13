'use client';

import {
    CalculatorMenuItem,
    EmissionsCalculator,
    TextInput,
    TransportMode,
    cnaughtTheme
} from '@/calculator';
import {
    Box,
    Button,
    Center,
    ChakraProvider,
    Collapse,
    HStack,
    Heading,
    Link,
    Spacer,
    Spinner,
    Text,
    VStack,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdDirectionsCar, MdFlight } from 'react-icons/md';
import wretch, { WretchError } from 'wretch';
import * as yup from 'yup';

import { OffsetStatus } from './OffsetStatus';

const formId = 'user-info-form';
const eventName = process.env.NEXT_PUBLIC_EVENT_NAME as string;

export default function Index() {
    const router = useRouter();
    const toast = useToast();
    const { isOpen: isMethodologyOpen, onToggle: onMethodologyToggle } =
        useDisclosure();
    const [isCalculatingEmissions, setIsCalculatingEmissions] = useState(false);
    const [transportMode, setTransportMode] =
        useState<TransportMode>('driving');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UserInfoSchema>({
        mode: 'onSubmit',
        resolver: yupResolver(userInfoSchema)
    });

    const co2eKg = form.watch('co2eKg');

    const onCalculating = useCallback(() => {
        form.clearErrors('co2eKg');
        setIsCalculatingEmissions(true);
    }, [form]);

    const onCalculateEmissions = useCallback(
        (
            originPlaceId: string | undefined,
            transportMode: TransportMode,
            emissionsKg: number
        ) => {
            form.setValue('originPlaceId', originPlaceId, {
                shouldValidate: true,
                shouldDirty: true
            });
            form.setValue('transportMode', transportMode, {
                shouldValidate: true,
                shouldDirty: true
            });
            form.setValue('co2eKg', emissionsKg, {
                shouldValidate: true,
                shouldDirty: true
            });
            setIsCalculatingEmissions(false);
        },
        [form]
    );

    const onSubmit = form.handleSubmit(
        async ({
            firstName,
            lastName,
            email,
            company,
            originPlaceId,
            transportMode,
            co2eKg
        }) => {
            setIsSubmitting(true);
            try {
                const resData = await wretch('/api/offset-travel')
                    .post({
                        firstName,
                        lastName,
                        email,
                        company,
                        originPlaceId,
                        transportMode,
                        amountKg: co2eKg
                    })
                    .json<{ offsetStatus: OffsetStatus }>();
                router.push(
                    resData.offsetStatus === OffsetStatus.AlreadyOffset
                        ? '/confirmation?alreadyOffset=true'
                        : '/confirmation'
                );
            } catch (e) {
                console.log(e);
                setIsSubmitting(false);
                toast({
                    title:
                        (e as WretchError).json.message ??
                        'Something went 2 wrong. Please try again.',
                    status: 'error',
                    isClosable: true,
                    position: 'top'
                });
            }
        }
    );

    return (
        <ChakraProvider theme={cnaughtTheme}>
            <FormProvider {...form}>
                <Center
                    w="full"
                    minH="100vh"
                    bgImage={{
                        base: 'none',
                        xl: "linear-gradient(to bottom, rgba(253, 246, 232, 1), rgba(253, 246, 232, 1) 20%, rgba(253, 246, 232, 0) 40%, rgba(253, 246, 232, 0) 60%, rgba(253, 246, 232, 1) 80%, rgba(253, 246, 232, 1) 100%), url('https://uploads-ssl.webflow.com/64f9dcfea8cacdb44c975021/65368ae22a0cc57ba63c4fa8_plane_flipped.jpg')"
                    }}
                    bgSize="cover, contain"
                    bgRepeat="no-repeat, no-repeat"
                    bgPos="center, center"
                    alignItems="stretch"
                >
                    <HStack
                        align="stretch"
                        justify={{ base: 'center', xl: 'flex-end' }}
                        w="full"
                    >
                        <VStack
                            maxWidth={{
                                base: 'none',
                                md: '80%',
                                lg: '2xl',
                                xl: '50%',
                                '2xl': '3xl'
                            }}
                            w="full"
                            justify="center"
                            spacing={10}
                            p={10}
                            bgColor="brand.cream"
                            boxShadow="xl"
                        >
                            <VStack w="full" maxW="md" spacing={12}>
                                <form
                                    id={formId}
                                    onSubmit={onSubmit}
                                    style={{ width: '100%' }}
                                >
                                    <VStack w="full" spacing={6}>
                                        <Heading
                                            fontSize="4xl"
                                            fontWeight="thin"
                                            textAlign="left"
                                            w="full"
                                        >
                                            Offset your travel to {eventName}!
                                        </Heading>
                                        <Text fontWeight="light">
                                            Answer a few simple questions, and
                                            we&rsquo;ll retire carbon credits to
                                            offset your travel here, at no cost.
                                        </Text>
                                        <VStack w="full" spacing={4}>
                                            <HStack
                                                w="full"
                                                spacing={4}
                                                align="flex-start"
                                            >
                                                <TextInput<UserInfoSchema>
                                                    name="firstName"
                                                    label="First name"
                                                />
                                                <TextInput<UserInfoSchema>
                                                    name="lastName"
                                                    label="Last name"
                                                />
                                            </HStack>
                                            <TextInput<UserInfoSchema>
                                                type="email"
                                                name="email"
                                                label="Work email"
                                            />
                                            <TextInput<UserInfoSchema>
                                                name="company"
                                                label="Company"
                                            />
                                        </VStack>
                                    </VStack>
                                </form>
                                <VStack w="full" spacing={4}>
                                    <Heading
                                        fontSize="2xl"
                                        fontWeight="thin"
                                        textAlign="left"
                                        w="full"
                                    >
                                        How did you get here?
                                    </Heading>
                                    <Spacer />
                                    <Center w="full" overflowX="hidden">
                                        <HStack
                                            align="flex-start"
                                            justify="flex-start"
                                            overflowX="auto"
                                            spacing={4}
                                        >
                                            <CalculatorMenuItem
                                                onClick={() =>
                                                    setTransportMode('driving')
                                                }
                                                icon={MdDirectionsCar}
                                                label="Driving"
                                                isActive={
                                                    transportMode === 'driving'
                                                }
                                            />
                                            <CalculatorMenuItem
                                                onClick={() =>
                                                    setTransportMode('flight')
                                                }
                                                icon={MdFlight}
                                                label="Flying"
                                                isActive={
                                                    transportMode === 'flight'
                                                }
                                            />
                                        </HStack>
                                    </Center>
                                    <VStack
                                        align="flex-start"
                                        w="full"
                                        spacing={5}
                                    >
                                        <EmissionsCalculator
                                            destinationAirportOptions={JSON.parse(
                                                process.env
                                                    .NEXT_PUBLIC_EVENT_DESTINATION_AIRPORTS as string
                                            )}
                                            transportMode={transportMode}
                                            calculateEmissionsUrl={`/api/calculate/${transportMode}`}
                                            onCalculatingEmissions={
                                                onCalculating
                                            }
                                            onCalculateEmissions={
                                                onCalculateEmissions
                                            }
                                        />
                                        {isCalculatingEmissions && <Spinner />}
                                        {!isCalculatingEmissions && co2eKg && (
                                            <Text fontWeight="light">
                                                Your round-trip will emit
                                                approximately {co2eKg} kilograms
                                                of CO&#8322;e.
                                            </Text>
                                        )}
                                        {form.formState.errors.co2eKg?.type ===
                                            'optionality' && (
                                            <Box
                                                color="red.500"
                                                fontSize="sm"
                                                lineHeight="normal"
                                            >
                                                You must calculate your
                                                emissions using the address
                                                input(s) above before offsetting
                                                them.
                                            </Box>
                                        )}
                                    </VStack>
                                    <Spacer />
                                    <VStack
                                        w="full"
                                        align="flex-start"
                                        spacing={4}
                                    >
                                        <Button
                                            form={formId}
                                            variant="primary"
                                            type="submit"
                                            isDisabled={
                                                isCalculatingEmissions ||
                                                isSubmitting
                                            }
                                            isLoading={isSubmitting}
                                            loadingText="Offsetting..."
                                        >
                                            Offset now
                                        </Button>
                                        <Text fontSize="xs" fontWeight="light">
                                            By using CNaught, you agree to the{' '}
                                            <Link
                                                href="https://www.cnaught.com/terms"
                                                isExternal
                                            >
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link
                                                href="https://www.cnaught.com/privacy"
                                                isExternal
                                            >
                                                Privacy Policy
                                            </Link>
                                        </Text>
                                    </VStack>
                                </VStack>
                                <Box w="full">
                                    <HStack justify="flex-end" w="full">
                                        <Link
                                            fontSize="sm"
                                            onClick={onMethodologyToggle}
                                        >
                                            {isMethodologyOpen
                                                ? 'Hide methodology'
                                                : 'Show methodology'}
                                        </Link>
                                    </HStack>
                                    <Collapse
                                        in={isMethodologyOpen}
                                        animateOpacity
                                    >
                                        <VStack
                                            align="flex-start"
                                            w="full"
                                            spacing={5}
                                        >
                                            <Heading
                                                fontSize="2xl"
                                                fontWeight="thin"
                                                textAlign="left"
                                                w="full"
                                            >
                                                Methodology
                                            </Heading>
                                            <Text fontWeight="light">
                                                CNaught uses its{' '}
                                                <Link
                                                    href="https://www.cnaught.com/blog/carbon-calculator-methodology"
                                                    isExternal
                                                >
                                                    carbon calculator
                                                    methodology
                                                </Link>{' '}
                                                to estimate the footprint of
                                                your travel here. For those who
                                                flew, we calculate based on a
                                                round-trip non-stop flight plus
                                                round-trip drive from the
                                                airport to the event location.
                                                For those who did not fly, we
                                                calculate based on a round-trip
                                                journey to the event location.
                                            </Text>
                                        </VStack>
                                    </Collapse>
                                </Box>
                            </VStack>
                        </VStack>
                    </HStack>
                </Center>
            </FormProvider>
        </ChakraProvider>
    );
}

const maxNameLength = 25; // Max length that fits on the certificate
const nameLengthErrorMsg = `First and last name together cannot be longer than ${maxNameLength} characters`;

const userInfoSchema = yup.object().shape(
    {
        firstName: yup
            .string()
            .trim()
            .required('Please provide your first name')
            .when('lastName', (lastName, schema) =>
                schema.max(maxNameLength - lastName.length, nameLengthErrorMsg)
            ),
        lastName: yup
            .string()
            .trim()
            .required('Please provide your last name')
            .when('firstName', (firstName, schema) =>
                schema.max(maxNameLength - firstName.length, nameLengthErrorMsg)
            ),
        email: yup
            .string()
            .trim()
            .email('Please provide a valid email')
            .required('Please provide your email'),
        company: yup
            .string()
            .trim()
            .required('Please provide your company')
            .max(
                maxNameLength,
                'Company name cannot be longer than ${max} characters'
            ),
        originPlaceId: yup.string().notRequired(),
        transportMode: yup.string().required(),
        co2eKg: yup.number().positive().required()
    },
    [['firstName', 'lastName']] // https://github.com/jquense/yup/issues/720#issuecomment-564591045
);

export type UserInfoSchema = yup.InferType<typeof userInfoSchema>;
