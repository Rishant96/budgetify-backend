const express = require("express");
const router = express.Router();

const Budget = require("./models/Budget");

router.get("/budgets", async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.send(budgets);
  } catch {
    res.status(404);
    res.send({ error: "User doesn't exist!" });
  }
});

router.get("/budgets/all/:email/:month", async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.params.email,
      month: parseFloat(req.params.month)
    });
    res.send(budgets);
  } catch {
    res.status(404);
    res.send({ error: "Budget doesn't exist!" });
  }
});

router.get("/budgets/all/:email", async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.params.email });
    res.send(budgets);
  } catch {
    res.status(404);
    res.send({ error: "User doesn't exist!" });
  }
});

router.post("/budgets", async (req, res) => {
  const budget = new Budget({
    ...req.body
  });
  await budget.save();
  res.send(budget);
});

router.get("/budgets/:id", async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id });
    res.send(budget);
  } catch {
    res.status(404);
    res.send({ error: "Budget doesn't exist!" });
  }
});

router.get("/budgets/total/:id", async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id });
    let total = 0;
    budget.items.forEach((itm) => {
      total += itm.amount;
    });
    console.log("total: ", total);
    res.send({ data: total });
  } catch {
    res.status(404);
    res.send({ error: "Budget doesn't exist!" });
  }
});

router.patch("/budgets/:id", async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id });

    if (req.body.name) {
      budget.name = req.body.name;
    }

    if (req.body.user) {
      budget.user = req.body.user;
    }

    if (req.body.month) {
      budget.month = req.body.month;
    }

    // if (req.body.items) {
    //   req.body.items.forEach((item) => {
    //     Budget.updateOne(
    //       { _id: budget._id, "items._id": item._id },
    //       {
    //         $set: {
    //           "items.$.title": item.title,
    //           "items.$.amount": item.amount
    //         }
    //       },
    //       (err) => {
    //         console.log(err);
    //       }
    //     );
    //   });
    // }

    await budget.save();
    res.status(204).send(budget);
  } catch {
    res.status(404);
    res.send({ error: "Budget doesn't exist!" });
  }
});

router.delete("/budgets/:id", async (req, res) => {
  try {
    await Budget.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

router.post("/budgets/:id", async (req, res) => {
  try {
    req.body.items.forEach((item) => {
      Budget.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { items: item } },
        { useFindAndModify: false },
        function (error, success) {
          if (error) {
            console.log(error);
          }
        }
      );
    });
    res.status(204).send(req.body.items);
  } catch {
    res.status(404);
    res.send({ error: "Budget doesn't exist!" });
  }
});

router.delete("/budgets/:id/:item_id", async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id });
    budget.items.pull({ _id: req.params.item_id });
    await budget.save();
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

module.exports = router;
