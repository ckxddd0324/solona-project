import type { NextPage } from "next"
import Head from "next/head"
import { Connected } from "../views"

const NewMint: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Solana Scaffold</title>
                <meta name="description" content="Basic Functionality" />
            </Head>
            <Connected />
        </div>
    )
}

export default NewMint
