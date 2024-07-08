import MainLayout from '../components/Layouts/MainLayout';
import CheckoutComponent from '../components/Checkout/CheckoutComponent';
import { useParams } from 'react-router-dom';
import logger from '../../logic/Logger/logger';


function CheckoutPage({ isBlueprint }) {

    const { id } = useParams();

    logger.log("Renderizando Checkput Page with Blueprint condition and value:", isBlueprint, id);

    return (
        <MainLayout>
            <CheckoutComponent
                transactionId={id}
                isBlueprint={isBlueprint}
            />
        </MainLayout>

    );
}

export default CheckoutPage;