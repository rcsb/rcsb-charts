import {
    AnnotationFeatures, Feature
} from "@rcsb/rcsb-api-tools/build/RcsbGraphQL/Types/Borrego/GqlTypes";
import {SwissModelQueryAnnotations} from "../../ExternalResources/SwissModel/SwissModelQueryAnnotations";
import {rcsbClient, RcsbClient} from "../../RcsbGraphQL/RcsbClient";
import {
    AnnotationRequestContext,
    AnnotationCollectorInterface
} from "./AnnotationCollectorInterface";
import {Subject} from "rxjs";
import {ObservableHelper} from "../../RcsbUtils/Helpers/ObservableHelper";

export class AnnotationCollector implements AnnotationCollectorInterface{

    readonly rcsbFvQuery: RcsbClient = rcsbClient;
    private requestStatus: "pending"|"complete" = "complete";
    private rawFeatures: Array<Feature>;
    private annotationFeatures: Array<AnnotationFeatures>;
    private readonly rawFeaturesSubject: Subject<Array<Feature>> = new Subject<Array<Feature>>();
    private readonly annotationFeaturesSubject: Subject<Array<AnnotationFeatures>> = new Subject<Array<AnnotationFeatures>>();

    public async collect(requestConfig: AnnotationRequestContext): Promise<Array<AnnotationFeatures>> {
        this.requestStatus = "pending";
        this.annotationFeatures = await this.requestAnnotations(requestConfig);
        if (requestConfig.collectSwissModel === true) {
            const swissModelData: Array<AnnotationFeatures> = await SwissModelQueryAnnotations.request(requestConfig.queryId);
            if(swissModelData && swissModelData.length > 0)
                this.annotationFeatures = this.annotationFeatures.concat(swissModelData);
        }
        if(typeof requestConfig?.annotationGenerator === "function") {
            const generatedFeatures: Array<AnnotationFeatures> = await requestConfig.annotationGenerator(this.annotationFeatures)
            if(generatedFeatures && generatedFeatures.filter((f)=>(f!=null)).length > 0)
                this.annotationFeatures = this.annotationFeatures.concat(generatedFeatures.filter((f)=>(f!=null)));
        }
        if(typeof requestConfig?.annotationFilter === "function") {
            this.annotationFeatures = await requestConfig.annotationFilter(this.annotationFeatures);
        }
        this.rawFeatures = [].concat.apply([], this.annotationFeatures.map(af=>af.features));
        this.complete();
        return this.annotationFeatures;
    }

    public async getFeatures(): Promise<Array<Feature>>{
        return new Promise<Array<Feature>>((resolve, reject)=>{
            if(this.requestStatus === "complete"){
                resolve(this.rawFeatures);
            }else{
                ObservableHelper.oneTimeSubscription<Array<Feature>>(resolve, this.rawFeaturesSubject);
            }
        });
    }

    public async getAnnotationFeatures(): Promise<Array<AnnotationFeatures>>{
        return new Promise<Array<AnnotationFeatures>>((resolve, reject)=>{
            if(this.requestStatus === "complete"){
                resolve(this.annotationFeatures);
            }else{
                ObservableHelper.oneTimeSubscription<Array<AnnotationFeatures>>(resolve, this.annotationFeaturesSubject);
            }
        })
    }

    private async requestAnnotations(requestConfig: AnnotationRequestContext): Promise<Array<AnnotationFeatures>> {
        return requestConfig.queryId ?
            await this.rcsbFvQuery.requestRcsbPdbAnnotations({
                queryId: requestConfig.queryId,
                reference: requestConfig.reference,
                sources: requestConfig.sources,
                filters: requestConfig.filters,
                range: requestConfig.range
            })
            :
            await this.rcsbFvQuery.requestRcsbPdbGroupAnnotations({
                group: requestConfig.group,
                groupId: requestConfig.groupId,
                sources: requestConfig.sources,
                filters: requestConfig.filters
            });
    }

    private complete(): void {
        this.requestStatus = "complete";
        this.annotationFeaturesSubject.next(this.annotationFeatures);
        this.rawFeaturesSubject.next(this.rawFeatures);
        console.info("Features Processing Complete");
    }

}

