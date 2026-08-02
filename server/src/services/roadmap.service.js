import { eq, asc } from "drizzle-orm";

import { db } from "../db/index.js";

import { roadmaps } from "../db/schema/roadmaps.js";
import { modules } from "../db/schema/modules.js";
import { lessons } from "../db/schema/lesson.js";

import { buildRoadmapPrompt } from "../prompts/roadmap.prompt.js";
import { generateRoadmap } from "./ai.service.js";



export async function generateRoadmapService(userId, request) {

  // Build AI prompt
  const prompt = buildRoadmapPrompt(request);


  // Generate roadmap using AI
  const result = await generateRoadmap(prompt);



  // Clean AI markdown response
  const cleanJson = result
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();



  let data;


  // Parse AI JSON safely
  try {

    data = JSON.parse(cleanJson);

  } catch(error) {

    console.log("Invalid AI JSON:");
    console.log(cleanJson);

    throw new Error(
      "AI returned invalid roadmap format"
    );

  }



  if(!data.roadmap || !data.modules){

    throw new Error(
      "AI response missing roadmap or modules"
    );

  }



  const savedRoadmap = await db.transaction(
    async(tx)=>{


    // Create roadmap
    const [roadmap] = await tx
      .insert(roadmaps)
      .values({

        userId,

        title:
          data.roadmap.title,

        career:
          request.career,

        level:
          request.level,

        goal:
          request.goal,

      })
      .returning();



    // Create modules
    for(
      let moduleIndex = 0;
      moduleIndex < data.modules.length;
      moduleIndex++
    ){


      const moduleData =
        data.modules[moduleIndex];



      const [savedModule] =
        await tx
        .insert(modules)
        .values({

          roadmapId:
            roadmap.id,

          title:
            moduleData.title,


          description:
            moduleData.description,


          estimatedDays:
            moduleData.estimatedDays,


          order:
            moduleIndex + 1,


          status:
            moduleIndex === 0
            ? "active"
            : "locked"

        })
        .returning();





      // Create lessons
      const lessonRows =
        moduleData.lessons.map(
          (lesson,index)=>({

          moduleId:
            savedModule.id,


          title:
            lesson.title,


          description:
            lesson.description,


          estimatedMinutes:
            lesson.estimatedMinutes,


          project:
            lesson.project,


          order:
            index + 1,


          status:
            moduleIndex === 0 &&
            index === 0

            ? "active"

            : "locked"

        }));



      if(lessonRows.length){

        await tx
        .insert(lessons)
        .values(lessonRows);

      }


    }



    // Set current module
    const [firstModule] =
      await tx
      .select()
      .from(modules)
      .where(
        eq(
          modules.roadmapId,
          roadmap.id
        )
      )
      .orderBy(
        asc(modules.order)
      )
      .limit(1);



    await tx
    .update(roadmaps)
    .set({

      currentModule:
        firstModule.id

    })
    .where(
      eq(
        roadmaps.id,
        roadmap.id
      )
    );



    return roadmap;


  });



  return {

    roadmap:
      savedRoadmap,

    ai:
      data

  };

}





// Get roadmap with modules and lessons

export async function getRoadmapService(id){


 const [roadmap] = await db
  .select()
  .from(roadmaps)
  .where(eq(roadmaps.id, id));

if (!roadmap) {
  throw new Error("Roadmap not found");
}

const roadmapModules = await db
  .select()
  .from(modules)
  .where(eq(modules.roadmapId, roadmap.id))
  .orderBy(modules.order);
  



  const modulesWithLessons =
    await Promise.all(

      roadmapModules.map(
        async(module)=>{


        const moduleLessons =
          await db
          .select()
          .from(lessons)
          .where(
            eq(
              lessons.moduleId,
              module.id
            )
          )
          .orderBy(
            asc(lessons.order)
          );



        return {

          ...module,

          lessons:
            moduleLessons

        };


      })

    );




  return {

    ...roadmap,

    modules:
      modulesWithLessons

  };


}