import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
// import { updateLocale } from "moment";
import { ajax } from "discourse/lib/ajax";

export default Component.extend({
    @discourseComputed('data.Attended','data.Bunked')
    percentage(attended,bunked){
        let total = parseInt(attended)+parseInt(bunked);
        if(total>0){
            return Math.round((attended*100)/(total));
        }else{
            return 0;
        }
    },
    @discourseComputed('data.Attended','data.Bunked','data.Mandatory')
    canBunk(attended,bunked,mandatory){
        let total = parseInt(attended)+parseInt(bunked);
        let percentage = (attended*100)/(total);
        if(percentage>mandatory){
            let canbunk = Math.round((attended / (.01 * mandatory)) - total);
            return "You can bunk "+canbunk+" lectures";
        }else{
            let needtoattend = Math.round((bunked * (mandatory / (100-mandatory))) - attended);
            return "Need to attend "+needtoattend+" lectures";
        }
    },
    updateData(name,update,type,operator){
        ajax('/attendance/update', {
            type: "PUT",
            data: {
                name:name,
                data:update,
                type:type
            }
        }).then((response)=>{
            if(type=="Attended" && operator=="inc"){
                this.incrementProperty('data.Attended');
            }else if(type=="Attended" && operator=="dec"){
                this.decrementProperty('data.Attended');
            }else if(type=="Bunked" && operator=="inc"){
                this.incrementProperty('data.Bunked');
            }
            else if(type=="Bunked" && operator=="dec"){
                this.decrementProperty('data.Bunked');
            }
        })
    },
    actions:{
        updateSubjectName(data){
            this.updateSubjectName(data);
        },
        deleteSubject(data){
            this.deleteSubject(data);
        },
        incAttended(){
            this.updateData(this.get('data.name'),(parseInt(this.get('data.Attended'))+1),"Attended","inc");
        },
        decAttended(){
            if(this.get('data.Attended')>0){
                this.updateData(this.get('data.name'),(parseInt(this.get('data.Attended'))-1),"Attended","dec");
            }
        },
        incBunked(){
            console.log("called");
            this.updateData(this.get('data.name'),parseInt(this.get('data.Bunked'))+1,"Bunked","inc");
        },
        decBunked(){
            if(this.get('data.Bunked')>0){
                this.updateData(this.get('data.name'),parseInt(this.get('data.Bunked'))-1,"Bunked","dec");
            }
        }
    }
});