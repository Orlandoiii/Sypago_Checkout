import MainLayout from '../components/Layouts/MainLayout';
import CheckoutComponent from '../components/Checkout/CheckoutComponent';
import { useParams } from 'react-router-dom';
import logger from '../../logic/Logger/logger';
import { useConfig } from '../contexts/ConfigContext';
import { useState } from 'react';
import LoginForm from '../components/Login/LoginForm';
import ShopPage from '../components/Shop/ShopPage';
import { themeConfig } from '../core/config/theme';
import { FormatAsFloat } from '../core/input/InputBox';

function CheckoutPageWithAuth({ id, isBlueprint }) {


    const activateLogin = themeConfig.activateLogin;


    const activateShop = themeConfig.activateShop;


    const [isAuthenticated, setIsAuthenticated] = useState(false);



    const [isPaying, setIsPaying] = useState(false);

    const [transactionId, setTransactionId] = useState(id);

    const [isBlueprintOperation, setIsBlueprintOperation] = useState(isBlueprint);

    if (activateLogin && !isAuthenticated) {
        return <LoginForm onSubmit={() => setIsAuthenticated(true)} />
    }

    else if (activateShop && !isPaying) {
        return <ShopPage onPay={(amt) => {

            const amountJson = JSON.stringify({ amount: amt })

            console.log("AMOUNT JSON:", amountJson)

            fetch("/digitel/request-sypago", {
                method: "POST",
                body: amountJson,
            }).then(res => {
                console.log("RESPONSE:", res)

                res.json().then(data => {
                    console.log("DATA:", data)

                    const tId = data?.transaction_id

                    console.log("TRANSACTION ID:", tId)
                    if (tId) {
                        setTransactionId(tId)
                        setIsBlueprintOperation(false)
                        setIsPaying(true)
                    } else {
                        alert("Error al obtener el ID de la transacción", data)
                    }

                }).catch(err => {
                    console.log("ERROR PARSING JSON:", err)
                })


            }).catch(err => {
                console.log("ERROR EJECUTANDO:", err)
            })
            //setIsPaying(true)
        }

        }

        />
    }

    else if ((!activateLogin || isAuthenticated) && (!activateShop || isPaying)) {
        return <CheckoutComponent
            transactionId={transactionId}
            isBlueprint={isBlueprintOperation}
        />
    }



}

function CheckoutPage({ isBlueprint }) {

    const { id } = useParams();

    logger.log("Renderizando Checkput Page with Blueprint condition and value:", isBlueprint, id);

    return (
        <MainLayout>
            <CheckoutPageWithAuth id={id} isBlueprint={isBlueprint} />
        </MainLayout>

    );
}

export default CheckoutPage;