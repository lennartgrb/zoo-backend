import { Hono } from "hono";
import { AnimalModel } from "../models/animals.js";
import { TierSchema } from "../types.js";

export const animalRouter = new Hono();

animalRouter.get("/", async (c) => {
  try {
    //Logik
    const animals = await AnimalModel.findAll();
    return c.json({
      data: animals,
    });
  } catch (error) {
    console.log(error);
    c.json({
      error: "Oh Snap! Something went wrong!",
    });
  }
});

animalRouter.get("/:id", async (c) => {
  try {
    //Logik
    const id = c.req.param("id");
    const animals = await AnimalModel.findAnimalById(id);
    return c.json({
      data: animals,
    });
  } catch (error) {
    console.log(error);
    c.json({
      error: "Oh Snap! Something went wrong!",
    });
  }
});

animalRouter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  try {
    const updatedAnimal = await AnimalModel.updateAnimal(id, body);

    if (updatedAnimal) {
      return c.json({ message: "Animal updated succesfully", data: updatedAnimal }, 200);
    } else {
      return c.text("Animal not found or update failed", 404);
    }
  } catch (error) {
    console.error("Error updating animals:", error);
    return c.text("Internal Server Error", 500);
  }
});

// animalRouter.post("/", async (c) => {
//   const body = await c.req.json();

//   try {
//     const newAnimal = await AnimalModel.createAnimal(body);

//     if (newAnimal) {
//       return c.json({ message: "Animal added succesfully", data: newAnimal }, 200);
//     } else {
//       return c.text("Animal not found or adding failed", 404);
//     }
//   } catch (error) {
//     console.error("Error adding animals:", error);
//     return c.text("Internal Server Error", 500);
//   }
// });

animalRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const result = await TierSchema.safeParseAsync(body);
    if (!result.success) return c.json({ error: result.error }, 400);
    return c.json(result.data);

    // const addAnimal = await AnimalModel.addAnimal(body);
    // if (addAnimal) {
    //   return c.json(
    //     { message: "Animal created succesfully", data: addAnimal },
    //     200
    //   );
    // }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return c.json({
        error: "No JSON body provided",
      });
    }
    console.error("Error create new Animal:", error);
    return c.text("Internal Server Error", 500);
  }
});

animalRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const deleteAnimal = await AnimalModel.deleteAnimal(id);

    if (deleteAnimal) {
      return c.json({ message: "Animal deleted succesfully", data: deleteAnimal }, 200);
    } else {
      return c.text("Animal not found or deleting failed", 404);
    }
  } catch (error) {
    console.error("Error deleting animals:", error);
    return c.text("Internal Server Error", 500);
  }
});

animalRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  try {
    const updatedAnimal = await AnimalModel.updateAnimalParticially(id, body);

    if (updatedAnimal) {
      return c.json({ message: "Animal updated succesfully", data: updatedAnimal }, 200);
    } else {
      return c.text("Animal not found or update failed", 404);
    }
  } catch (error) {
    console.error("Error updating animals:", error);
    return c.text("Internal Server Error", 500);
  }
});
