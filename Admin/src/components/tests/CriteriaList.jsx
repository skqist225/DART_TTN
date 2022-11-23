import { Table } from "flowbite-react";
import React from "react";
import { tailwindCss } from "../../tailwind";
import LevelBadge from "../common/LevelBadge";

function CriteriaList({ criteria }) {
    return (
        <Table striped={true}>
            <Table.Head>
                <Table.HeadCell>STT</Table.HeadCell>
                <Table.HeadCell>Chương</Table.HeadCell>
                <Table.HeadCell>Số câu hỏi</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
                {criteria.map(({ chapter, levelAndNumbers }, index) => (
                    <Table.Row
                        className='bg-white dark:border-gray-700 dark:bg-gray-800'
                        key={chapter}
                    >
                        {" "}
                        <Table.Cell className={tailwindCss.tableViewerCell}>{index + 1}</Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>{chapter}</Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>
                            {levelAndNumbers.map(({ level, numberOfQuestions }) => (
                                <LevelBadge
                                    level={level}
                                    numberOfQuestions={numberOfQuestions}
                                    key={chapter + level + numberOfQuestions}
                                />
                            ))}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

export default CriteriaList;
