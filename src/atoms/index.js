import { IconArrowLeft } from '@douyinfe/semi-icons';
import { useState } from 'react';
import React, { useNavigate } from 'react-router-dom';

export function LeaveIcon({ path }) {
  const [isActive, setIsActive] = useState(false); //鼠标悬停变色
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(path);
  };
  return (
    <>
      <IconArrowLeft
        style={{ color: isActive ? '#0064f8' : '' }}
        onClick={() => {
          handleClick();
        }}
        onMouseLeave={() => setIsActive(false)}
        onMouseEnter={() => setIsActive(true)}
      />
    </>
  );
}
