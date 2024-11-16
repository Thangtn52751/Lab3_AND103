
const express = require('express');

const app = express();

const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

const COMMON = require('./COMMON');

const uri = COMMON.uri;

const mongoose = require('mongoose');

const cakeModel = require('./cakeModel');

const apiMobile = require('./api');
app.use('/api', apiMobile);

app.get('/', async (req, res) => {
    await mongoose.connect(uri);

    let cake = await cakeModel.find();

    console.log(cake);

    res.send(cake);

})

app.post('/add_cake', async (req, res) => {
    try {
        await mongoose.connect(uri);
        const cake = req.body;
        const result = await cakeModel.create(cake);
        res.status(201).send(result); // Trả về thông tin bánh vừa thêm
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.patch('/update/:name', async (req, res) => {
    try {
        await mongoose.connect(uri);

        const currentName = req.params.name; // Lấy tên hiện tại từ URL
        const { newName, price } = req.body; // Lấy dữ liệu từ body

        // Kiểm tra dữ liệu đầu vào
        if (!newName || !price) {
            return res.status(400).send({ error: 'newName và price là bắt buộc để cập nhật.' });
        }

        // Thực hiện cập nhật
        const result = await cakeModel.updateOne(
            { name: currentName }, // Điều kiện tìm kiếm
            { name: newName, price: price } // Dữ liệu cập nhật
        );

        res.send(result); // Trả về kết quả
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



app.delete('/delete/:id', async (req, res) => {
    try {
        await mongoose.connect(uri);

        const id = req.params.id; // Lấy ID từ URL

        // Kiểm tra nếu ID không hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: 'ID không hợp lệ.' });
        }

        // Thực hiện xóa
        const result = await cakeModel.deleteOne({ _id: id });

        // Kiểm tra nếu không tìm thấy và xóa được
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'Không tìm thấy bánh với ID này.' });
        }

        res.send({ message: 'Xóa thành công', result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


