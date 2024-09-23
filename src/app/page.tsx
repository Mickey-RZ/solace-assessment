"use client";
import { useEffect, useState, useCallback } from "react";
import { Input, Button, Typography, Table, Box, IconButton, Stack } from "@mui/joy";
import TablePagination from '@mui/material/TablePagination';
import debounce from "lodash.debounce";
import ClearIcon from '@mui/icons-material/Clear';

export default function Home() {
    const [advocates, setAdvocates] = useState([]);
    const [filteredAdvocates, setFilteredAdvocates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadPage()
    }, []);

    useEffect(() => {
        loadPage()
    }, [page, rowsPerPage]);

    const loadPage = (keyword?: string) => {
        const params = {keyword: keyword === undefined ? searchTerm : keyword, rowsPerPage, page};
        const queryString = new URLSearchParams(params).toString();
        fetch(`/api/advocates?${queryString}`)
            .then((response) => {
                response.json().then((jsonResponse) => {
                        setAdvocates(jsonResponse.data);
                        setFilteredAdvocates(jsonResponse.data);
                        setTotalCount(jsonResponse.count);
                    }
                );
            });
    };

    const filterAdvocates = useCallback(
        (term) => {
            setSearchTerm(term);
            loadPage(term)
        },
        [advocates]
    );

    const debouncedFilterAdvocates = useCallback(debounce(filterAdvocates, 300), [
        filterAdvocates,
    ]);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedFilterAdvocates(term);
    };

    const resetSearch = () => {
        setSearchTerm("");
        setFilteredAdvocates(advocates);
        loadPage("")

    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        loadPage()
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <Box sx={{ margin: "24px" }}>
            <Typography level="h1">Solace Advocates</Typography>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Typography level="body2" sx={{ marginBottom: "8px" }}>
                    Searching for: {searchTerm || "All"}
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                    <Input
                        placeholder="Enter text"
                        value={searchTerm}
                        onChange={handleSearch}
                        endDecorator={searchTerm && (<IconButton variant="plain" size="sm" onClick={resetSearch}><ClearIcon /></IconButton>)}
                    />
                </Box>
            </Stack>
            <Table aria-label="Advocates Table" stickyHeader
                   sx={{minWidth: 650, "& thead th": {backgroundColor: "primary.light"}}}>
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>City</th>
                    <th>Degree</th>
                    <th style={{width: '40%'}}>Specialties</th>
                    <th>Years of Experience</th>
                    <th>Phone Number</th>
                </tr>
                </thead>
                <tbody>
                {filteredAdvocates.map((advocate) => (
                    <tr key={advocate.phoneNumber}>
                        <td>{advocate.firstName}</td>
                        <td>{advocate.lastName}</td>
                        <td>{advocate.city}</td>
                        <td>{advocate.degree}</td>
                        <td>
                            {advocate.specialties.map((s, index) => (
                                <Typography key={index}>
                                    <li>{s}</li>
                                </Typography>
                            ))}
                        </td>
                        <td>{advocate.yearsOfExperience}</td>
                        <td>{advocate.phoneNumber}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                style={{ position: 'sticky', bottom: 0, background: 'white' }}
            />
        </Box>
    );
}
