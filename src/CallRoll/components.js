import {Descriptions, InputNumber, List, Spin} from "@douyinfe/semi-ui";
import React from "react";
import { IconDelete } from '@douyinfe/semi-icons';


export function Students({students, isGroup, changePointsButton, course, isDelete}) {
    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
        margin: '8px 2px',
    };
    return (
        <>
            {Array.isArray(students) ? (
                <List
                    grid={{
                        gutter: 12,
                        xs: 0,
                        sm: 0,
                        md: 12,
                        lg: 8,
                        xl: 8,
                        xxl: 6,
                    }}
                    dataSource={students}
                    renderItem={item => (
                        <List.Item style={style}>
                            <div>
                                <h3 style={{
                                    color: 'var(--semi-color-text-0)',
                                    fontWeight: 500
                                }}>{!isGroup && item.isCall ? '😇' : ''}{item.name}{isDelete?<IconDelete/>:""}</h3>
                                {changePointsButton ? <InputNumber defaultValue={item.points} onChange={num => {
                                        fetch(`http://localhost:4000/${course}/${item.id}`, {
                                            method: 'PATCH',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({points: num}), // 将 points 设置为一个数值
                                        })
                                    }}/> :
                                    <Descriptions
                                        align="center"
                                        size="small"
                                        row
                                        data={[
                                            {key: '分数', value: item.points}
                                        ]}
                                    />}
                            </div>
                        </List.Item>
                    )}
                />
            ) : (
                <Spin/>
            )}
        </>
    )
}