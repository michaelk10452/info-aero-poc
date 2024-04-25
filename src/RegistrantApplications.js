import React, { useState, useEffect } from 'react';
import getApplications from './getApplications';
import { Table, TableCell, TableRow, TableHead, TableBody, Loader, Alert, View, Heading } from '@aws-amplify/ui-react';

function SitaApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getApplications().then(applicationsData => {
            setApplications(applicationsData.data); // Assuming applicationsData.data contains the array of applications
            setIsLoading(false);
        }).catch(error => {
            setError(error.message || 'An error occurred while fetching applications');
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <Loader size="large" variation="default" />
        );
    }

    if (error) {
        return (
            <Alert variation="error" isDismissible={false}>
                {error}
            </Alert>
        );
    }

    return (
        <View padding="2rem">
            <Heading level={1}>All Applications</Heading>
            <Table variation="striped">
                <TableHead>
                    <TableRow>
                        <TableCell as="th">Organization</TableCell>
                        <TableCell as="th">Contact Name</TableCell>
                        <TableCell as="th">Telephone</TableCell>
                        <TableCell as="th">Email</TableCell>
                        <TableCell as="th">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {applications.map((app, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{app.organization}</TableCell>
                            <TableCell>{app.contactName}</TableCell>
                            <TableCell>{app.telephone}</TableCell>
                            <TableCell>{app.email}</TableCell>
                            <TableCell>{app.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </View>
    );
}

export default SitaApplications;