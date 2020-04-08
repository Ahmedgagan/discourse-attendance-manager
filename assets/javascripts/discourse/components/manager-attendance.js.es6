import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { ajax } from "discourse/lib/ajax";

export default Component.extend({
    update:false,
    display:false,
    init() {
        this._super(...arguments);
        let attendance = this.get('attendance')
        if(attendance.length==0){
            this.display = false;
        }else{
            this.display = true;
        }
    },
    @discourseComputed('attendance.@each.Attended')
    totalAttended(){
        let attendance = this.get('attendance');
        let attendedArray = attendance.map(sub=>parseInt(sub.Attended))
       return attendedArray.reduce((a,b) => a + b, 0);
    },
    @discourseComputed('attendance.@each.Bunked')
    totalBunked(){
        let attendance = this.get('attendance');
        let bunkedArray = attendance.map(sub=>parseInt(sub.Bunked));
       return bunkedArray.reduce((a,b) => a + b, 0);
    },

    @discourseComputed('totalAttended', 'totalBunked')
    totalLectures(totalAttended, totalBunked){
        return totalAttended+totalBunked ;
    },

    @discourseComputed('totalAttended', 'totalLectures')
    totalPercentage(totalAttended, totalLectures){
        if(totalLectures>0){
            return Math.round(100*(totalAttended/totalLectures));
        }else{
            return 0;
        }
    },
    actions:{
        updateNote(name,mandatory,attended,bunked){
            if(!name){
                return;
            }
            if(!mandatory){
                return;
            }
            if(!attended){
                attended = "0";
            }
            if(!bunked){
                bunked = "0";
            }
            let previousName = this.get('previousName');
            ajax('/attendance/update/subject', {
                type: "PUT",
                data: {
                    name:name,
                    attended:attended,
                    bunked:bunked,
                    mandatory:mandatory,
                    previousName:previousName.name
                }
            }).then((response)=>{
                let attendance = this.get('attendance');
                let index = attendance.findIndex((item)=>item['name']==previousName['name'])
                // debugger;
                if (index > -1) {
                    attendance[index] = {
                        "name":name,
                        "Attended":attended,
                        "Bunked":bunked,
                        "Mandatory":mandatory,
                    };   
                }
                this.set('attendance', attendance);
                this.notifyPropertyChange('attendance');
                this.setProperties({
                    'name':null,
                    'attended':null,
                    'bunked':null,
                    'mandatory':null,
                    'previousName':{},
                    'update':false
                });
            });
        },
        deleteSubject(data){
            ajax('/attendance/delete', {
                type: "DELETE",
                data: {
                    name:data.name,
                }
            }).then((result)=>{
                let attendance = this.get('attendance');
                let index = attendance.findIndex((item)=>item['name']==data.name)
                if (index > -1) {
                    attendance.splice(index,1);
                    this.set('attendance', attendance);
                    this.notifyPropertyChange('attendance');
                }
                if(attendance.length==0){
                    this.set('display',false);
                    this.notifyPropertyChange('display');
                    console.log(this.get('display'));
                }
            });
        },
        updateSubjectName(data) {
            this.setProperties({
                'name':data.name,
                'attended':data.Attended,
                'bunked':data.Bunked,
                'mandatory':data.Mandatory,
                'previousName':{
                    'name':data.name,
                    'Attended':data.Attended,
                    'Bunked':data.Bunked,
                    'Mandatory':data.Mandatory
                },
                'update':true
            });
        },
        insertNote(name,mandatory,attended,bunked){
            if(!name){
                return;
            }
            if(!mandatory){
                return;
            }
            if(!attended){
                attended = "0";
            }
            if(!bunked){
                bunked = "0";
            }
            ajax('/attendance/insert', {
                type: "PUT",
                data: {
                    name,attended,bunked,mandatory
                }
            }).then((response)=>{
                this.set('display',true);
                console.log(this.get('display'));
                this.notifyPropertyChange('attendance');
                const attendance = this.get('attendance');
                attendance.push({
                    "name":name,
                    "Attended":attended,
                    "Bunked":bunked,
                    "Mandatory":mandatory,
                });
                this.set('attendance', attendance);
                this.notifyPropertyChange('attendance');
                this.setProperties({
                    'name':null,
                    'attended':null,
                    'bunked':null,
                    'mandatory':null,
                    'update':false
                });
            });
        }
    }
});