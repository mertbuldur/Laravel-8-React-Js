<?php

namespace App\Http\Controllers\api\category;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
class indexController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = request()->user();
        $categories = Category::where('userId',$user->id)->get();

        return response()->json([
            'success'=>true,
            'data'=>$categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = request()->user();
        $name = $request->name;
        $create = Category::create([
            'userId'=>$user->id,
            'name'=>$name
        ]);
        if($create){
            return response()->json(['success'=>true]);
        }
        else {
            return response()->json(['success'=>false,'message'=>'Kategori Eklemedi']);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = request()->user();
        $control = Category::where('userId',$user->id)->where('id',$id)->count();
        if($control == 0) { return response()->json(['success'=>false,'message'=>'Kategori size ait degil']);}
        $category = Category::where('id',$id)->first();
        return response()->json([
            'success'=>true,
            'category'=>$category
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = request()->user();
        $control = Category::where('userId',$user->id)->where('id',$id)->count();
        if($control == 0) { return response()->json(['success'=>false,'message'=>'Kategori size ait degil']);}
        $update = Category::where('id',$id)->update([
            'name'=>$request->name
        ]);
        if($update){
            return response()->json(['success'=>true]);
        }
        else 
        {
            return response()->json(['success'=>false,'message'=>'Ürün düzenlenemedi']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = request()->user();
        $control = Category::where('userId',$user->id)->where('id',$id)->count();
        if($control == 0) { return response()->json(['success'=>false,'message'=>'Kategori size ait degil']);}
        Category::where('id',$id)->delete();
        return response()->json(['success'=>true,'message'=>'Kategori Silindi']);
    }
}
