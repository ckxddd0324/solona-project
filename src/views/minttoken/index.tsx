import {
    Button,
    Container,
    Heading,
    VStack,
    Text,
    HStack,
    Image,
} from "@chakra-ui/react"
import {
    FC,
    MouseEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import { PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
    Metaplex,
    walletAdapterIdentity,
    CandyMachine,
} from "@metaplex-foundation/js"
import { useRouter } from "next/router"

export const Connected: FC = () => {
    const { connection } = useConnection()
    const walletAdapter = useWallet()
    const [candyMachine, setCandyMachine] = useState<CandyMachine>()
    const [candyMachineData, setCandyMachineData] = useState(null)

    const [isMinting, setIsMinting] = useState(false)

    const metaplex = useMemo(() => {
        return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    }, [connection, walletAdapter])

    const fetchCandyMachine = async () => {


        try {
            const candyMachine = await metaplex.candyMachinesV2().findByAddress({ address: new PublicKey("AGPdrGg6wM5Gi56zrnS57YS7cd38c9LUz92Xsx4q2swx") })

            setCandyMachineData(candyMachine)
        } catch (e) {
            alert("Please submit a valid CMv2 address")
        }
    }

    useEffect(() => {
        fetchCandyMachine()
    }, [])

    const router = useRouter()

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        async (event) => {
            if (event.defaultPrevented) return

            if (!walletAdapter.connected || !candyMachineData) {
                return
            }

            try {
                setIsMinting(true)
                const nft = await metaplex.candyMachinesV2().mint({ candyMachine: candyMachineData })

                console.log(nft)
                router.push(`/newMint?mint=${nft.nft.address.toBase58()}`)
            } catch (error) {
                alert(error)
            } finally {
                setIsMinting(false)
            }
        },
        [metaplex, walletAdapter, candyMachineData]
    )

    return (
        <VStack spacing={20}>
            <Container>
                <VStack spacing={8}>
                    <Heading
                        color="white"
                        as="h1"
                        size="2xl"
                        noOfLines={1}
                        textAlign="center"
                    >
                        Welcome Buildoor.
                    </Heading>

                    <Text color="bodyText" fontSize="xl" textAlign="center">
                        Each buildoor is randomly generated and can be staked to receive
                        <Text as="b"> $BLD</Text>. Use your <Text as="b"> $BLD</Text> to
                        upgrade your buildoor and receive perks within the community!
                    </Text>
                </VStack>
            </Container>

            <HStack spacing={10}>
                <Image src="0.png" alt="" />
                <Image src="1.png" alt="" />
                <Image src="2.png" alt="" />
                <Image src="3.png" alt="" />
                <Image src="4.png" alt="" />
            </HStack>

            <Button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={handleClick}
                isLoading={isMinting}
            >
                <Text>mint buildoor</Text>
            </Button>
        </VStack>
    )
}

export default Connected