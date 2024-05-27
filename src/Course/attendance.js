import { Table, Avatar } from '@douyinfe/semi-ui';
import React from "react";


export function attendanceModal() {
    const columns = [
        {
            title: '时间',
            dataIndex: 'updateTime',
        },
        {
            title: "姓名",
            dataIndex: 'student',
        },
        {
            title: '详情',
            dataIndex: 'state',
        },
    ];
    const data = [
        {
            key: '1',
            updateTime: '2024/3/8上午',
            student: "李真",
            state: "缺席"
        },
        {
            key: '2',
            updateTime: '2024/3/8上午',
            student: "李真2",
            state: "缺席"
        },
        {
            key: '3',
            updateTime: '2024/3/8上午',
            student: "李真3",
            state: "缺席"
        },
    ];
    return(
        <>
            <Table columns={columns} dataSource={data} pagination={false} />
        </>
    )
}