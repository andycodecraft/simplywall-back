const pool = require('../connection');
const { format, isToday, isYesterday } = require('date-fns');

exports.getNews = async (req, res) => {
    try {
        const query = 'SELECT * FROM news'
        let [news] = await pool.query(query);

        if (news) {
            news = news.map(item => {
                const originalDate = new Date(item.date);
                let formattedDate;

                if (isToday(originalDate)) {
                    formattedDate = `Today, ${format(originalDate, 'h:mm a')}`;
                } else if (isYesterday(originalDate)) {
                    formattedDate = `Yesterday, ${format(originalDate, 'h:mm a')}`;
                } else {
                    formattedDate = format(originalDate, 'MMM dd, yyyy');
                }

                return {
                    ...item,
                    date: formattedDate
                };
            });
        }
        const resData = {
            status: true,
            response: news
        }

        res.status(200).json(resData);
    } catch (error) {
        const resData = {
            status: false,
            response: error.message
        }
        res.status(400).json(resData);
    }
}