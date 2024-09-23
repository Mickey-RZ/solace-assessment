import db from "../../../db";
import {advocates} from "../../../db/schema";
import {advocateData} from "../../../db/seed/advocates";
import {or, ilike } from 'drizzle-orm';
import {sql} from 'drizzle-orm/sql';

export async function GET(request) {
    const url = new URL(request.url);
    const searchTerm = `%${url.searchParams.get('keyword') || ''}%`;
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('rowsPerPage') || 10;
    console.log(limit)

    const data = await db.select().from(advocates)
        .where(or(
            ilike (advocates.firstName, searchTerm),
            ilike (advocates.lastName, searchTerm),
            ilike (advocates.city, searchTerm),
            ilike (advocates.degree, searchTerm),
            sql`CAST(advocates.payload AS TEXT) ILIKE ${'%' + searchTerm + '%'}`,
            sql`CAST(advocates.phone_number AS TEXT) LIKE ${'%' + searchTerm + '%'}`,
            sql`CAST(advocates.years_of_experience AS TEXT) LIKE ${'%' + searchTerm + '%'}`
        ))
        .limit(parseInt(limit))
        .offset(parseInt(limit) * parseInt(page));
    console.log(data.length)

    let count = await db.select({ count: sql`COUNT(*)` }).from(advocates)
        .where(or(
            ilike (advocates.firstName, searchTerm),
            ilike (advocates.lastName, searchTerm),
            ilike (advocates.city, searchTerm),
            ilike (advocates.degree, searchTerm),
            sql`CAST(advocates.payload AS TEXT) ILIKE ${'%' + searchTerm + '%'}`,
            sql`CAST(advocates.phone_number AS TEXT) LIKE ${'%' + searchTerm + '%'}`,
            sql`CAST(advocates.years_of_experience AS TEXT) LIKE ${'%' + searchTerm + '%'}`
        ));
    count = count[0]?.count;


    // const data = advocateData;

    return Response.json({data, count});
}
