import { useNavigate} from "react-router-dom";
import styles from './index.module.css';
import { useState } from "react"
import { Typography, Divider, Button, Input } from '@douyinfe/semi-ui';
import { IconArrowLeft } from '@douyinfe/semi-icons';

function AddCourse() {
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false); // 新增状态来控制样式
    const { Title, Text } = Typography;
    const handleMouseDown = () => {
        setIsActive(true);
    };

    const handleMouseUp = () => {
        setIsActive(false);
    };

    const handleClick = () => {
        navigate("/Login");
    };
    return(
        <div>
            <IconArrowLeft
                className={`${styles.arrowIcon} ${isActive ? styles.active : ''}`}
                onClick={()=>{handleClick()}}
                onMouseLeave={handleMouseUp}
                onMouseEnter={handleMouseDown}
            />
            <Title heading={3} style={{ margin: '8px 0' }} >请选择您的课程</Title>
        </div>
    )
}

export default AddCourse;