function calculateResults(incomingData) {

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    const pointsPerTransaction = incomingData.map(transaction => {
        let points = 0;
        let over100 = transaction.amt - 100;

        if (over100 > 0) {
            points += over100 * 2;
        }
        if (transaction.amt > 50) {
            points += 50;
        }
        const month = new Date(transaction.transactionDt).getMonth();
        return { ...transaction, points, month };
    });

    let byCustomer = {};
    let totalPointsByCustomer = {};
    pointsPerTransaction.forEach(pointsPerTransaction => {
        let { custid, name, month, points } = pointsPerTransaction;
        if (!byCustomer[custid]) {
            byCustomer[custid] = [];
        }
        if (!totalPointsByCustomer[custid]) {
            totalPointsByCustomer[name] = 0;
        }
        totalPointsByCustomer[name] += points;
        if (byCustomer[custid][month]) {
            byCustomer[custid][month].points += points;
            byCustomer[custid][month].monthNumber = month;
            byCustomer[custid][month].numTransactions++;
        } else {
            byCustomer[custid][month] = {
                custid,
                name,
                monthNumber: month,
                month: months[month],
                numTransactions: 1,
                points
            };
        }
    });
    let tot = [];
    for (var custKey in byCustomer) {
        byCustomer[custKey].forEach(cRow => {
            tot.push(cRow);
        });
    }
    let totByCustomer = [];
    for (custKey in totalPointsByCustomer) {
        totByCustomer.push({
            name: custKey,
            points: totalPointsByCustomer[custKey]
        });
    }
    return {
        summaryByCustomer: tot,
        pointsPerTransaction,
        totalPointsByCustomer: totByCustomer
    };
}

export default calculateResults;