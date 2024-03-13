import styles from './styles.module.css';
import CustomPaginationActionsTable from "./myLocalsTable";


export default function MyEquipments() {
    return (
        <div className={styles.mainContainer}>
            <CustomPaginationActionsTable/>
        </div>
    )
}